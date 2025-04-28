const myPromise = new Promise((success, error) => {
  setTimeout(() => {
    const isSuccess = true; // Simulate an operation's success or failure
    if (isSuccess) {
      success("Operation succeeded!");
    } else {
      error("Operation failed.");
    }
  }, 2000);
});

console.log(myPromise);

myPromise
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
