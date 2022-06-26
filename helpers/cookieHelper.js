import Cookies from 'js-cookie'

export const createCookie = (key, value, expiresIn) => {
  Cookies.set(key, value, { expires: expiresIn, path: '/' })
}