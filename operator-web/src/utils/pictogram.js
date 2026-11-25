import stopwatchIcon from '../assets/test_stopwatch.svg';
import warningIcon from '../assets/warning.svg';

const files = import.meta.glob('../assets/pictograms/*.svg', {
  eager: true,
  import: 'default',
});

const byName = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.split('/').pop().replace('.svg', ''),
    url,
  ]),
);

export function getPictogram(name, widget) {
  return byName[name] || (widget === 'timer' ? stopwatchIcon : warningIcon);
}