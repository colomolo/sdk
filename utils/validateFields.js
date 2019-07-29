const throwErrorWithCode = require('./throwErrorWithCode')

const FIELDS_REQUIRED = [
  'payeeId',
  'payerId',
  'paymentSystem',
  'paymentMethod',
  'amount',
  'currency',
  'comment'
]

module.exports = (payment) => {
  let failedField = ''

  const isAllRequiredFieldsPresent = FIELDS_REQUIRED
    .every((field) => {
      if (Object.keys(payment).includes(field)) return true

      failedField = field
      return false
    })

  if (!isAllRequiredFieldsPresent)
    throwErrorWithCode('Validation failed"', 'ERR_VALIDATION', {
      message: `${failedField} field is required`,
      path: [failedField],
      value: 'null',
    })
}
