import Histify from "./";

test("should be sorted", () => {
  const histify = new Histify("1,2,1,4,3,6");
  expect(histify.samples).toEqual([1, 1, 2, 3, 4, 6]);
});

test("classes", () => {
  const histify = new Histify("1,2,3,4,5,6,7");
  const classes = histify.classes();
  expect(classes[0]).toEqual(1.6);
  expect(classes[9]).toEqual(7);
});

test("frequencies", () => {
  const histify = new Histify("1,1,3,3,3,3,3,3,8,10");
  const frequencies = histify.frequency();
  expect(frequencies).toEqual([2, 0, 6, 0, 0, 0, 0, 1, 0, 1]);
});

test("summary", () => {
  const histify = new Histify("1,1,12,2,2,2,2,2,2,2,4,5,6,7,9,8,9");
  expect(histify.summary()).toMatchSnapshot();
  console.log(histify.summary());
});
