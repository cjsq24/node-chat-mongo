export const exec = async (res, action) => {
   try {
      await action()
   } catch (e) {
      if (e?.parent?.message) {
         res.status(400).json({ success: false, values: {}, message: databaseValidation(e) })
      } else {
         console.log(e)
         console.log(e.toString())
         res.status(400).json({ success: false, values: {}, message: 'Ha ocurrido un error en el servidor', errorMessage: e.toString() })
      }
   }
}

const databaseValidation = (e) => {
   try {
      console.log('*************************************************************')
      console.log('SQL ERROR: ', e.parent.sqlMessage)
      console.log('-------------------------------------------------------------')
      console.log('SQL: ', e.parent.sql)
      console.log('*************************************************************')
      if (e.errors[0].validatorKey == 'not_unique') {
         if (e.errors[0].path == 'name') {
            return 'Name exists'
         } else if (e.errors[0].path == 'code') {
            return 'Code exists'
         } else if (e.errors[0].path == 'email') {
            return 'Email exists'
         }
      }
      return 'Operation Failed'
   } catch (e) {
      console.log(' ')
      console.log(e)
      console.log(' ')
      return 'Ha ocurrido un error en el servidor'
   }
}