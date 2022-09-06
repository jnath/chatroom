export const getImageKitUrl = (src: string) => {
  const rmUrl = '/v0/b/chatroom-64934.appspot.com/o/';
  return `https://ik.imagekit.io/nkk2qyic0/${new URL(src).pathname.replace(rmUrl, '').replace('%2F', '/')}`
}
