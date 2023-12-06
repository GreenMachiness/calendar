exports.pathLogger = (req, res, next) => {

  const getMonthName = (monthNumber) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return monthNames[monthNumber]
  }
  
  const now = new Date()
  const year = now.getFullYear() // return year
  const month = now.getMonth() // return month(0 - 11)
  const date = now.getDate() // return date (1 - 31)
  const hours = now.getHours() // return number (0 - 23)
  const minutes = now.getMinutes() // return number (0 -59)

  const formattedDate = `${date} ${getMonthName(month).substring(0,3)} ${year} ${hours}:${minutes}` // 4 January 2020 0:56

  console.log(`[${formattedDate}]:`, `${req.method} ${req.path}`)
  next()
}