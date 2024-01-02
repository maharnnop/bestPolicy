// export function findInputError(errors, name) {
//     const filtered = Object.keys(errors)
//       .filter(key => key.includes(name))
//       .reduce((cur, key) => {
//         return Object.assign(cur, { error: errors[key] })
//       }, {})
//     return filtered
//   }

  export function findInputError(errors, name) {
    const error = errors[name];
    
    if (error) {
      return { error };
    }
  
    // Check for nested fields
    const nestedErrors = Object.keys(errors)
      .filter(key => key.startsWith(`${name}.`))
      .reduce((nested, key) => {
        const nestedKey = key.replace(`${name}.`, '');
        return Object.assign(nested, { [nestedKey]: errors[key] });
      }, {});
  
    if (Object.keys(nestedErrors).length > 0) {
      return { error: nestedErrors };
    }
  
    return {};
  }