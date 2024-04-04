import React, { useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { css, cx} from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { Tresholds } from '@repo/treshold-editor/src';

export interface ProgressBarPanelProps {
  height: number;
  tresholds: Tresholds;
  bgColor: string;
}

interface Props extends PanelProps<ProgressBarPanelProps> {}

const overrideStyles = `
[class*="-panel-content"] {
  padding: 0 !important;
}

[class*="-panel-header"] {
  display: none !important;
}`

const getStyles = () => {
  return {
    wrapper: css`
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    `,
    progressBarWrapper: css`
      width: 100%;
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
      (treshold.isToStrict ? value < treshold.valueTo : value <= treshold.valueTo)
  );

  if (!treshold) {
    return 'linear-gradient(to right, #00CA51, #00CA51)';
  }

  return treshold.isGradient
    ? `linear-gradient(to right, ${treshold.gradientColors?.map((treshold) => treshold.color).join(', ')})`
    : `linear-gradient(to right, ${treshold.color}, ${treshold.color})`;
};

export const ProgressBarPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  const valuesField = data.series?.[0]?.fields.filter(field => field.name === 'value')?.[0];

  const lastValue = valuesField?.values?.slice(-1)?.[0] || 0
  const isInIframe = window.document.URL.includes("auth_token")

  useEffect(() => {

    if(!isInIframe) return 

    var head = document.head;
    var style = document.createElement("style");

    style.id = "override";
    style.innerHTML = overrideStyles;

    head.appendChild(style);

    return () => { head.removeChild(style); }

  }, [isInIframe]);

  return (
    <>
    <div className={cx(styles.wrapper,
    css`
    background: ${options.bgColor};
    `
    )}>
      <div
        className={cx(
          styles.progressBarWrapper,
          css`
            height: ${options.height}px;
          `
        )}
      >
        <div
          className={cx(
            styles.progress,
            css`
              width: ${lastValue}%;
              border-radius: ${lastValue >= 99 ? '100px' : '100px 0px 0 100px'};
              background-image: ${getProgressBarColorByValue(lastValue, options.tresholds)};
            `
          )}
        />
      </div>
    </div>
    </>
  );
};
