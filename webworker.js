onmessage = e => {
  console.log(e);
  setTimeout(() => {
    postMessage({
      id: e.data.id,
      name: 'test',
    });
  }, 3000);
};
