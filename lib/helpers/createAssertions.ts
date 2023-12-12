export async function createAssertions(object: object, paramName = "body"): Promise<void> {
  for (const key in object) {
    const value = object[key];

    if (typeof value === "string") {
      console.log(`expect(${paramName}.${key}).toBe("${value}");`);
    } else if (value === null) {
      console.log(`expect(${paramName}.${key}).toBeNull();`);
    } else if (typeof value === "number") {
      console.log(`expect(${paramName}.${key}).toBe(${value});`);
    } else if (typeof value === "object") {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          console.log(`expect(${paramName}.${key}).toEqual([]);`);
        } else if (typeof value[0] === "object") {
          createAssertions(value, `${paramName}.${key}`);
        } else {
          const newArray = value.map((item: string | number | null) =>
            typeof item === "string" ? `"${item}"` : (item as number)
          );
          console.log(`expect(${paramName}.${key}).toEqual([${newArray}]);`);
        }
      } else if (Object.keys(value).length === 0) {
        console.log(`expect(${paramName}.${key}).toEqual({});`);
      } else if (parseInt(key) >= 0) {
        createAssertions(value, `${paramName}[${key}]`);
      } else {
        createAssertions(value, `${paramName}.${key}`);
      }
    }
  }
}
