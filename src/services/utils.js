/* Utility with deliberate anti-patterns for code review demo */

// Synchronous XHR - blocks main thread
export function fetchSync(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false); // false makes it synchronous
  try {
    xhr.send(null);
    if (xhr.status === 200) {
      return xhr.responseText;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

// Busy-wait loop - performance issue
export function sleep(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

// Magic number and non-constant condition
export function calculateDiscount(price) {
  if (price > 123.4567) {
    return price * 0.1234; // arbitrary magic numbers
  }
  return price * 0.1;
}
