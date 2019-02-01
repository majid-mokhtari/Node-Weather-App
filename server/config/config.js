const env = process.env.NODE_ENV || 'development'
console.log(`${env} environment`)
if (env === 'development') {
  process.env.PORT = 8010
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (env === 'test') {
  process.env.PORT = 8010
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}
