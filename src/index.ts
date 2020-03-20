import termSize from "term-size";

type Option = {
  steps?: number;
  significantDigits?: number;
};

export default class Histify {
  static defaultOption = { steps: 10, significantDigits: -2 };
  samples: number[] = [];
  options: Required<Option>;
  constructor(data: string, option: Option = {}) {
    this.options = { ...Histify.defaultOption, ...option };
    this.samples.push(
      ...data
        .toString()
        .trim()
        .split("\n")
        .reduce<number[]>((prev, line) => {
          prev.push(
            ...line
              .split(",")
              .map(x => parseInt(x, 10))
              .filter(value => !Number.isNaN(value))
          );
          return prev;
        }, [])
    );
    this.samples.sort((a, b) => a - b);
  }

  public minimum = () => Math.min(...this.samples);
  public maximum = () => Math.max(...this.samples);
  public sum = () => this.samples.reduce((prev, sample) => prev + sample, 0);
  public count = () => this.samples.length;
  public average = () => this.sum() / this.count();
  public variance = (unbiased = false) => {
    const average = this.average();
    const count = this.count();
    return (
      this.samples.reduce(
        (prev, sample) => prev + Math.pow(average - sample, 2),
        0
      ) / (unbiased ? count - 1 : count)
    );
  };
  public stdev = () => Math.pow(this.variance(), 0.5);
  public stdevp = () => Math.pow(this.variance(true), 0.5);
  public classes = () => {
    const min = this.minimum();
    const max = this.maximum();
    const delta = (max - min) / this.options.steps;
    return Array(this.options.steps)
      .fill(0)
      .map((_0, index) => min + delta * (index + 1));
  };
  public frequency = () => {
    const classes = this.classes();
    const frequencies = Array(classes.length).fill(0);
    this.samples.map(sample => {
      for (let index = 0; index < classes.length; index++) {
        const max = classes[index];
        if (sample <= max) {
          frequencies[index]++;
          break;
        }
      }
    });
    return frequencies;
  };
  public histogram = () => {
    const shift = Math.pow(10, this.options.significantDigits * -1);
    const yLabels = this.classes().map(sample => {
      const max = (Math.round(shift * sample) / shift).toString();
      return `to ${max}`;
    });

    const digits = Math.max(...yLabels.map(label => label.length));
    const frequencies = this.frequency();
    const maxValue = Math.max(...frequencies);

    const barBases = yLabels.map(
      max => `${max.toString().padStart(digits, " ")} ┃ `
    );

    const remainingColumns = termSize().columns - barBases[0].length - 1;
    const columns = frequencies.map(value =>
      Math.floor((value * remainingColumns) / maxValue)
    );

    const bars = barBases.map(
      (base, index) => base + "*".repeat(columns[index])
    );

    const footerBase = "━".repeat(barBases[0].length - 2) + "╋";
    const footer =
      footerBase +
      "━".repeat(bars[0].length - footerBase.length) +
      "\n" +
      " ".repeat(footerBase.length + 1) +
      "0" +
      " ".repeat(
        bars[0].length - footerBase.length - maxValue.toString().length - 2
      ) +
      maxValue;
    bars.push(footer);

    return bars.join("\n");
  };

  public summary = () => `samples: ${this.count()}
average: ${this.average()}
variance: ${this.variance()}
STDEV: ${this.stdev()}
STDEPV: ${this.stdevp()}

${this.histogram()}
  `;
}
