export function assignToEmpty(oldObject, newObject) {
  return Object.assign({}, oldObject, newObject);
}

export function objectsToArray(obj) {
  return Object.keys(obj).map(key => {
    obj[key].id = key;
    return obj[key];
  });
}
