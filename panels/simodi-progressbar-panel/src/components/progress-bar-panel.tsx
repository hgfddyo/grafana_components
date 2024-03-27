import React from 'react';
import { PanelProps } from '@grafana/data';
import { css, cx } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { Tresholds } from '@repo/treshold-editor/src';

export interface ProgressBarPanelProps {
  progressBarValue: number;
  height: number;
  tresholds: Tresholds;
}

interface Props extends PanelProps<ProgressBarPanelProps> {}

const getStyles = () => {
  return {
    wrapper: css`
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `,
    progressBarWrapper: css`
      background-color: #2d2d42;
      border-radius: 100px;
      position: relative;
    `,
    progress: css`
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      border-radius: 100px;
      height: 100%;
    `,
  };
};

const getProgressBarColorByValue = (value: number, tresholds: Tresholds): string => {
  const treshold = tresholds.find(
    (treshold) => 
      (treshold.isFromStrict ? value > treshold.valueFrom : value >= treshold.valueFrom) &&
      (treshold.isToStrict ?  value < treshold.valueTo : value <= treshold.valueTo)
  );

  if (!treshold) {
    return 'linear-gradient(to right, #00CA51, #00CA51)';
  }
  console.log(treshold.gradientColors?.map(treshold => treshold.color).join(', '))
  return treshold.isGradient ? `linear-gradient(to right, ${treshold.gradientColors?.map(treshold => treshold.color).join(', ')})` : `linear-gradient(to right, ${treshold.color}, ${treshold.color})`;
};

export const ProgressBarPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <div
        className={cx(
          styles.progressBarWrapper,
          css`
            width: ${width}px;
            height: ${options.height}px;
          `
        )}
      >
        <div
          className={cx(
            styles.progress,
            css`
              width: ${options.progressBarValue}%;
              border-radius: ${options.progressBarValue >= 99 ? '100px' : '100px 0px 0 100px'};
              background-image: ${getProgressBarColorByValue(options.progressBarValue, options.tresholds)};
            `
          )}
        />
      </div>
    </div>
  );
};