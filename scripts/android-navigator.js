/* Android-like navigation stack */

window.MindsEyeNav = (() => {
  const stack = [];
  const recents = [];

  function push(route) {
    stack.push(route);
    recents.unshift(route);
    if (recents.length > 12) recents.pop();
  }

  function current() {
    return stack.length ? stack[stack.length - 1] : null;
  }

  function back() {
    if (stack.length > 1) stack.pop();
    return current();
  }

  function home() {
    stack.length = 0;
    push({ type: "home" });
    return current();
  }

  function getRecents() {
    return recents.slice(0, 8);
  }

  return { push, current, back, home, getRecents };
})();
