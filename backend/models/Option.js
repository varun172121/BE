class Option {
  constructor(optionId, optionDesc, isCorrect = false) {
    this.optionId = optionId;
    this.optionDesc = optionDesc;
    this.isCorrect = isCorrect;
  }
  toJson = () => {
    return {
      optionId: this.optionId,
      optionDesc: this.optionDesc,
      isCorrect: this.isCorrect,
    };
  };
}

export default Option;