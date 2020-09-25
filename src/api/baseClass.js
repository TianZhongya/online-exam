class Pagination {
  pageCount ;
  pageNum;
  perPage;
  rowCount
}
class Role {
  static ADMIN = 1;
  static STUDENT = 2;
  static TEACHER = 3;
}

function forName (row, col, cellVal, index) {
  switch (cellVal) {
    case Role.ADMIN: return '管理员'
    case Role.STUDENT: return '学生'
    case Role.TEACHER: return '老师'
  }
}

export {
  Pagination,
  Role,
  forName
}
