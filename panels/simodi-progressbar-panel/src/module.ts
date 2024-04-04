import { PanelPlugin } from '@grafana/data';
import { ProgressBarPanel, ProgressBarPanelProps } from './components/progress-bar-panel';
import { TresholdsEditor } from '@repo/treshold-editor/src';

export const plugin = new PanelPlugin<ProgressBarPanelProps>(ProgressBarPanel).setPanelOptions((builder) => {
  return builder
    .addNumberInput({
      path: 'height',
      category: ['Styles'],
      name: 'Height of progress bar',
      description: 'Change height of progress bar to custom',
      defaultValue: 16,
    })
    .addColorPicker({
      path: 'bgColor',
      category: ['Styles'],
      name: 'Background color of progress bar panel',
      description: 'Change background color of progress bar to custom',
      defaultValue: '',
    })
    .addCustomEditor({
      id: 'tresholds',
      path: 'tresholds',
      category: ['Tresholds'],
      name: 'Tresholds of progress bar',
      description: 'Change tresholds of progress bar to custom',
      editor: TresholdsEditor,
      defaultValue: [],
    });
});
