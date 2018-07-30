import { Fxios } from 'fxios'
import appConfig from 'share/config'

export const config = {
  credentials: 'include',
  redirect: 'manual',
  mode: 'cors',
  cache: 'reload',
  base: appConfig.baseURL,
}

const fxios = new Fxios(config)

export default fxios
