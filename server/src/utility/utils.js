/**
 * Checks if required environment variables are present
**/

exports.checkConfig = () => {
  const missingVars = []

  console.log('***Config Check***')
  console.log(`Running node in "${process.env.NODE_ENV || 'development'}"`)
  if (!process.env.SECRET_KEY) {
    missingVars.push("SECRET_KEY")
  }
  if (missingVars.length > 0) {
    const errorMsg = `Missing Environment Variable: [${missingVars.join(', ')}]. Add the missing variables to an .env file and restart the application.`
    throw new Error(errorMsg)
  }
  console.log('All Environment Variables Configured!')
  console.log('******************')
}