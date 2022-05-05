


class ExamInstruction {
  constructor(title,subtitle,bullets) {
    this.title = title;
    this.subtitle = subtitle;
    this.bullets = [];
    bullets.map((bullet) => {
        this.bullets.push(bullet);
    })
  }
  
  toJson = () => {
      return {
          title: this.title,
          subtitle: this.subtitle,
          bullets: this.bullets
        };
    };
}

export default ExamInstruction;