document.addEventListener('readystatechange', () => {
  switch (document.readyState) {
    case 'loading':
      console.log('0: loading..');
      break;
    case 'interactive':
      console.log('1: interactive..');
      break;
    case 'complete':
      // console.log('3: complete.');
      break;
    default:
      break;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  console.log('2: DOM fully loaded and parsed');
});

window.addEventListener('load', () => {
  console.log('3: load complete');

  if ('performance' in window && performance.getEntriesByType) {
    const paintMetrics = performance.getEntriesByType('paint');
    if (paintMetrics !== undefined && paintMetrics.length > 0) {
      paintMetrics.forEach(paintMetric => {
        console.log(`${paintMetric.name}: ${Math.round(paintMetric.startTime)} ms`);
      });
    }
  }
});
