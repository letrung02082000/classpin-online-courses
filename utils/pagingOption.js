module.exports = function (page, totalPages) {
  // let begin = (page - 1) * perPage;
  // let end = (page * perPage);
  //let pageBegin = (page >= 5 ? page - 4 : 1);
  //let pageEnd = ((totalPage - page) >= 5 ? page + 4 : totalPage);
  let pageBegin, pageEnd;
  if (totalPages < 10) {
    pageBegin = 1;
    pageEnd = totalPages;
  } else {
    if (page < 5) {
      pageBegin = 1;
      pageEnd = 9;
    } else if (totalPages - page < 5) {
      pageBegin = totalPages - 8;
      pageEnd = totalPages;
    } else {
      pageBegin = page - 4;
      pageEnd = page + 4;
    }
  }
  //allCourses = allCourses.slice(begin, end);
  console.log('-----------------------');
  let pageArr = [];
  for (let i = pageBegin; i <= pageEnd; i++) {
    pageArr.push(i);
  }
  console.log(pageArr);
  return pageArr;
}