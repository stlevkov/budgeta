function loanSort(expenses: any){
    const sortedData = [...expenses];
    sortedData.sort((a, b) => {
      // First, sort by the "loan" property (true comes first)
      if (a.loan && !b.loan) {
        return -1; // a comes first
      } else if (!a.loan && b.loan) {
        return 1; // b comes first
      }
      // If both have the same "loan" value or both don't have "loan", 
      // then sort by the "value" property in descending order
      return b.value - a.value;
    });
    return sortedData;
  };

export default loanSort