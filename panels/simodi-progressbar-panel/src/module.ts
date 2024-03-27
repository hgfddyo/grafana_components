import { PanelPlugin } from '@grafana/data';
import { ProgressBarPanel, ProgressBarPanelProps } from './components/progress-bar-panel';
import { TresholdsEditor } from '@repo/treshold-editor/src';

export const plugin = new PanelPlugin<ProgressBarPanelProps>(ProgressBarPanel).setPanelOptions((builder) => {
  return builder
    .addNumberInput({
      path: 'progressBarValue',
      settings: {max: 100, min: 0},
      category: ['Styles'],
      name: 'Value of progress bar',
      description: 'Value',
      defaultValue: 0,
    })
    .addNumberInput({
      path: 'height',
      category: ['Styles'],
      name: 'Height of progress bar',
      description: 'Change height of progress bar to custom',
      defaultValue: 16,
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
