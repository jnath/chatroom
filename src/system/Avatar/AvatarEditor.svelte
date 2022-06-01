<script lang="ts" context="module">
  export interface ImageState {
    x: number
    y: number
    width?: number
    height?: number
    resource?: HTMLImageElement
  }

  export interface State {
    drag: boolean
    mx?: number
    my?: number
    image: ImageState
  }

  export interface Position {
    x: number
    y: number
  }
</script>
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import { loadImageURL } from './utils/loadImageURL';
  import { loadImageFile } from './utils/loadImageFile';
  import { isFileAPISupported } from './utils/isFileAPISupported';
  import { isPassiveSupported } from './utils/isPassiveSupported';
  import { isTouchDevice } from './utils/isTouchDevice';

  const dispatch = createEventDispatcher();

  export let crossOrigin: '' | 'anonymous' | 'use-credentials' | undefined = undefined;

  export let scale = 1;
  export let width = 200;
  export let height = 200;
  export let rotate = 0;
  export let border: number | [number, number] = 25;
  export let borderRadius = 200;
  export let color = [0, 0, 0, 0.25];
  export let image: string | File | undefined = undefined;
  export let backgroundColor: string | undefined = undefined;

  export let disableBoundaryChecks = false;
  export let disableHiDPIScaling = false;
  export let disableCanvasRotation = true;
  export let dataUrl: string;

  const defaultEmptyImage = {
    x: 0.5,
    y: 0.5,
  }
  let canvas: HTMLCanvasElement;
  let position: Position = { x: 0.5, y: 0.5 };
  let pixelRatio =
    typeof window !== 'undefined' && window.devicePixelRatio
      ? window.devicePixelRatio
      : 1;

  const state = writable<State>({
    drag: false,
    my: undefined,
    mx: undefined,
    image: defaultEmptyImage,
  });

  const isVertical = () => {
    return !disableCanvasRotation && rotate % 180 !== 0
  }

  const getBorders = (borders = border) => {
    return Array.isArray(borders) ? borders : [borders, borders]
  }

  const getDimensions = () => {

    const canvas = { width: 0, height: 0 }

    const [borderX, borderY] = getBorders(border)

    if (isVertical()) {
      canvas.width = height
      canvas.height = width
    } else {
      canvas.width = width
      canvas.height = height
    }

    canvas.width += borderX * 2
    canvas.height += borderY * 2

    return {
      canvas,
      rotate,
      width,
      height,
      border,
    }
  }

  const getInitialSize = (width: number, height: number) => {
    let newHeight: number
    let newWidth: number

    const dimensions = getDimensions()
    const canvasRatio = dimensions.height / dimensions.width
    const imageRatio = height / width

    if (canvasRatio > imageRatio) {
      newHeight = dimensions.height
      newWidth = width * (newHeight / height)
    } else {
      newWidth = dimensions.width
      newHeight = height * (newWidth / width)
    }

    return {
      height: newHeight,
      width: newWidth,
    }
  }

  const handleImageReady = (imageEl: HTMLImageElement) => {
    $state.drag = false;
    $state.image = {
      ...getInitialSize(imageEl.width, imageEl.height),
      resource: imageEl,
      x: 0.5,
      y: 0.5,
    };
    dispatch('on:image:ready')
    dispatch('on:load:success', { image: $state.image })
  }

  const loadImage = async (file: File | string) => {
    if (isFileAPISupported && file instanceof File) {
      try {
        const imageFile = await loadImageFile(file)
        handleImageReady(imageFile)
      } catch (error) {
        dispatch('on:load:failure');
      }
    } else if (typeof file === 'string') {
      try {
        const imageFile = await loadImageURL(file, crossOrigin)
        handleImageReady(imageFile)
      } catch {
        dispatch('on:load:failure');
      }
    }
  }

  const getCanvas = (): HTMLCanvasElement => {
    if (!canvas) {
      throw new Error(
        'No canvas found',
      )
    }

    return canvas
  }

  const getContext = () => {
    const context = getCanvas().getContext('2d')
    if (!context) {
      throw new Error(
        'No context found',
      )
    }

    return context
  }

  // Draws a rounded rectangle on a 2D context.
  const drawRoundedRect = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number,
  ) => {
    if (borderRadius === 0) {
      context.rect(x, y, width, height)
    } else {
      const widthMinusRad = width - borderRadius
      const heightMinusRad = height - borderRadius
      context.translate(x, y)

      context.arc(
        borderRadius,
        borderRadius,
        borderRadius,
        Math.PI,
        Math.PI * 1.5,
      )
      context.lineTo(widthMinusRad, 0)
      context.arc(
        widthMinusRad,
        borderRadius,
        borderRadius,
        Math.PI * 1.5,
        Math.PI * 2,
      )
      context.lineTo(width, heightMinusRad)
      context.arc(
        widthMinusRad,
        heightMinusRad,
        borderRadius,
        Math.PI * 2,
        Math.PI * 0.5,
      )
      context.lineTo(borderRadius, height)
      context.arc(
        borderRadius,
        heightMinusRad,
        borderRadius,
        Math.PI * 0.5,
        Math.PI,
      )
      context.translate(-x, -y)
    }
  }

  const paint = (context: CanvasRenderingContext2D) => {
    context.save()
    context.scale(pixelRatio, pixelRatio)
    context.translate(0, 0)
    context.fillStyle = 'rgba(' + color.slice(0, 4).join(',') + ')'

    const dimensions = getDimensions()
    const [borderSizeX, borderSizeY] = getBorders(dimensions.border)
    const height = dimensions.canvas.height
    const width = dimensions.canvas.width

    // clamp border radius between zero (perfect rectangle) and half the size without borders (perfect circle or "pill")
    borderRadius = Math.max(borderRadius, 0)
    borderRadius = Math.min(
      borderRadius,
      width / 2 - borderSizeX,
      height / 2 - borderSizeY,
    )
    context.fill('evenodd')

    context.setLineDash([5, 5])
    context.strokeStyle = getComputedStyle(canvas).getPropertyValue("--ae-stroke-color");
    context.lineWidth = 2.5;

    context.beginPath()
    // inner rect, possibly rounded
    drawRoundedRect(
      context,
      borderSizeX,
      borderSizeY,
      width - borderSizeX * 2,
      height - borderSizeY * 2,
      borderRadius,
    )
    context.stroke();
    context.rect(width, 0, -width, height) // outer rect, drawn "counterclockwise"
    context.fill('evenodd')

    context.restore()
  }

  const getXScale = () => {
    if (!$state.image.width || !$state.image.height)
      throw new Error('Image dimension is unknown.')

    const canvasAspect = width / height
    const imageAspect = $state.image.width / $state.image.height

    return Math.min(1, canvasAspect / imageAspect)
  }

  const getYScale = () => {
    if (!$state.image.width || !$state.image.height)
      throw new Error('Image dimension is unknown.')

    const canvasAspect = height / width
    const imageAspect = $state.image.height / $state.image.width

    return Math.min(1, canvasAspect / imageAspect)
  }

  const getCroppingRect = () => {
    const newPosition = position || {
      x: $state.image.x,
      y: $state.image.y,
    }
    const width = (1 / scale) * getXScale()
    const height = (1 / scale) * getYScale()

    const croppingRect = {
      x: newPosition.x - width / 2,
      y: newPosition.y - height / 2,
      width,
      height,
    }

    let xMin = 0
    let xMax = 1 - croppingRect.width
    let yMin = 0
    let yMax = 1 - croppingRect.height

    // If the cropping rect is larger than the image, then we need to change
    // our maxima & minima for x & y to allow the image to appear anywhere up
    // to the very edge of the cropping rect.
    const isLargerThanImage =
      disableBoundaryChecks || width > 1 || height > 1

    if (isLargerThanImage) {
      xMin = -croppingRect.width
      xMax = 1
      yMin = -croppingRect.height
      yMax = 1
    }

    return {
      ...croppingRect,
      x: Math.max(xMin, Math.min(croppingRect.x, xMax)),
      y: Math.max(yMin, Math.min(croppingRect.y, yMax)),
    }
  }

  const distance = (touches: TouchList) => {
    return Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
  };

  let startDistance: number;
  $: startDistance = 0;

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!$state.drag) {
      return
    }

    e.preventDefault() // stop scrolling on iOS Safari

    if (e instanceof TouchEvent && e.touches.length === 2) {
      // Safari provides event.scale as two fingers move on the screen
      // For other browsers just calculate the scale manually
      const deltaDistance = distance(e.touches);
      // scale = deltaDistance / startDistance;
      if(startDistance>deltaDistance){
        scale = Math.max(Math.min( scale - .01, 10), .1);
      } else if (startDistance<deltaDistance){
        scale = Math.max(Math.min( scale + .01, 10), .1);
      }
    }

    const mousePositionX =
      'targetTouches' in e ? e.targetTouches[0].pageX : e.clientX
    const mousePositionY =
      'targetTouches' in e ? e.targetTouches[0].pageY : e.clientY

    rotate %= 360
    rotate = rotate < 0 ? rotate + 360 : rotate

    if (
      $state.mx &&
      $state.my &&
      $state.image.width &&
      $state.image.height
    ) {
      const mx = $state.mx - mousePositionX;
      const my = $state.my - mousePositionY;

      const width = $state.image.width * scale;
      const height = $state.image.height * scale;

      let { x: lastX, y: lastY } = getCroppingRect();

      lastX *= width
      lastY *= height

      // helpers to calculate vectors
      const toRadians = (degree: number) => degree * (Math.PI / 180)
      const cos = Math.cos(toRadians(rotate))
      const sin = Math.sin(toRadians(rotate))

      const x = lastX + mx * cos + my * sin
      const y = lastY + -mx * sin + my * cos

      const relativeWidth = (1 / scale) * getXScale()
      const relativeHeight = (1 / scale) * getYScale()

      position = {
        x: x / width + relativeWidth / 2,
        y: y / height + relativeHeight / 2,
      }

      $state.image.x = position.x;
      $state.image.y = position.y;
    }
    $state.mx = mousePositionX;
    $state.my = mousePositionY;
  }

  const handleMouseUp = (e: MouseEvent | TouchEvent) => {
    if ($state.drag) {
      $state.drag = false;
    }
    // if(e instanceof TouchEvent && e.touches.length === 2){
    //   startDistance = distance(e.touches);
    // }
  }

  const clearImage = () => {
    const canvas = getCanvas()
    const context = getContext()

    context.clearRect(0, 0, canvas.width, canvas.height)
    $state.image = defaultEmptyImage;
  }

  $: if(canvas && ( width || height)){
    image && loadImage(image) || clearImage();
  }

  const calculatePosition = (image = $state.image, borders?: number | [number, number]) => {
    const [borderX, borderY] = getBorders(borders)

    if (!image.width || !image.height) {
      throw new Error('Image dimension is unknown.')
    }

    const croppingRect = getCroppingRect()

    const width = image.width * scale
    const height = image.height * scale

    let x = -croppingRect.x * width
    let y = -croppingRect.y * height

    if (isVertical()) {
      x += borderY
      y += borderX
    } else {
      x += borderX
      y += borderY
    }

    return { x, y, height, width }
  }

  const paintImage = (
    context: CanvasRenderingContext2D,
    imageState: ImageState,
    borders: number | [number, number],
    scaleFactor = pixelRatio,
  ) => {
    if (!imageState.resource) return

    const newPosition = calculatePosition(imageState, borders)
    context.save()

    context.translate(context.canvas.width / 2, context.canvas.height / 2)
    context.rotate((rotate * Math.PI) / 180)
    context.translate(-(context.canvas.width / 2), -(context.canvas.height / 2))

    if (isVertical()) {
      context.translate(
        (context.canvas.width - context.canvas.height) / 2,
        (context.canvas.height - context.canvas.width) / 2,
      )
    }

    context.scale(scaleFactor, scaleFactor);

    context.globalCompositeOperation = 'destination-over'
    context.drawImage(
      imageState.resource,
      newPosition.x,
      newPosition.y,
      newPosition.width,
      newPosition.height,
    )

    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    context.restore()
  }

  let context: CanvasRenderingContext2D | null;
  $: context = null;

  $: if(context && scale){
    context.clearRect(0, 0, getCanvas().width, getCanvas().height);
    paintImage(context, $state.image, border);
    dataUrl = canvas.toDataURL();
    paint(context);
  }

  onMount(()=>{
    // scaling by the devicePixelRatio can impact performance on mobile as it creates a very large canvas.
    // This is an override to increase performance.
    if (disableHiDPIScaling) {
      pixelRatio = 1
    }

    context = getContext();

    if (image) {
      loadImage(image);
    }
    paint(context);

    const options = isPassiveSupported() ? { passive: false } : false;
    document.addEventListener('mousemove', handleMouseMove, options);
    document.addEventListener('mouseup', handleMouseUp, options);

    if (isTouchDevice) {
      document.addEventListener('touchstart', handleMouseDown, options);
      document.addEventListener('touchmove', handleMouseMove, options);
      document.addEventListener('touchend', handleMouseUp, options);
    }

    return ()=>{
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      if (isTouchDevice) {
        document.removeEventListener('touchstart', handleMouseDown);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      }
    }
  })

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    // if e is a touch event, preventDefault keeps
    // corresponding mouse events from also being fired
    // later.
    e.preventDefault();
    state.update((s)=>({ ...s, drag: true, mx: undefined, my: undefined}));
    if(e instanceof TouchEvent && e.touches.length === 2){
      startDistance = distance(e.touches)
    }
  }

  const handleMousewheel = (e: WheelEvent)=>{
    const more = e.deltaY > 0;
    if(more){
      scale = Math.max(Math.min( scale + .1, 10), .1);
    }else{
      scale = Math.max(Math.min( scale - .1, 10), .1);
    }
  }

  $: dimensions = getDimensions();
</script>

<canvas
  bind:this={canvas}
  width={dimensions.canvas.width * pixelRatio}
  height={dimensions.canvas.width * pixelRatio}
  on:mousedown={handleMouseDown}
  on:wheel={handleMousewheel}
  style:width="{dimensions.canvas.width}px"
  style:height="{dimensions.canvas.height}px"
  style:cursor="{$state.drag ? 'grabbing' : 'grab'}"
  style:touchAction="none"
  style:--ae-stroke-color="var(--palette-primary-main)"
/>
