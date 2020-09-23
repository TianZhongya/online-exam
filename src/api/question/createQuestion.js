import axios from 'axios'

const Type = {
  choice: 1,
  multi_choice: 2,
  trueOrFalse: 3,
  shortAnswer: 5
}

function forTypeName (id) {
  if (id === 1) return '单选'
  if (id === 2) return '多选'
  if (id === 3) return '判断'
  if (id === 5) return '简答'
}

function typeFormatter (row, col, cellVal, index) {
  return forTypeName(cellVal)
}

class Params {
  question = {
    typeId: 0,
    answer: {
      optionId: 0,
      optionIds: [
        0
      ],
      text: '',
      trueOrFalse: null
    },
    description: {
      options: [
        null
      ],
      title: ''
    }
  };

  subjectId = 0;
}

export const initParams = function () {
  return new Params()
}

export function request (data) {
  let suffix = null
  switch (data.question.typeId) {
    case 1:
      suffix = 'choice'
      break
    case 2:
      suffix = 'multiChoice'
      break
    case 3:
      suffix = 'tf'
      break
    case 5:
      suffix = 'shortAnswer'
      break
    default:
      throw Error('不支持的typeId ' + data)
  }
  return axios.post('/api/v1/teacher/questions/' + suffix, data)
}

export default { initParams, request, Type, forTypeName, typeFormatter }
