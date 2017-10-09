const isProd = process.env.NODE_ENV === 'production'

export const rootPath = 'halo'
export const serverRootPath = 'inmanage'
export const routeRootPath = isProd ? `/${rootPath}` : ''
export const routeLoginPath = '/login'
export const routeIndexPath = '/home'
