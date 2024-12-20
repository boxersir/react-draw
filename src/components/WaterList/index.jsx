import { useEffect, useState } from 'react';
import { max } from 'lodash';
//https://blog.csdn.net/qq_46665317/article/details/136563482

const VirtualWaterList  = (props) => {
  const {
    overallData,
    containerHeight,
    containerWidth,
    itemWidth,
    itemMaxWidth,
    maxSpace,
    containerRef,
    handleItemHeight,
    handleChildElement,
    isDefaultBottom,
    handleThrowData,
  } = props;

  // 存储每一列当时的高度，判断下一个元素应该存放在哪里
  // const [heightArr, setHeightArr] = useState<number[]>([]);
  // 当前瀑布流的总数据，带元素高度和自身偏移量和子数据
  const [renderData, setRenderData] = useState([]);
  // 纵向数据存储，根据窗口截取数据
  const [verticalSortingData, setVerticalSortingData] = useState();
  // 可视区域数据，所渲染的数据
  const [visualAreaData, setVisualAreaData] = useState();

  // 找到长度最小的数组的下标
  const minArrIndex = (harr=[]) => {
    let min = harr[0];
    let minIndex = 0;
    for (let i = 1; i < harr.length; i++) {
      if (harr[i] < min) {
        min = harr[i];
        minIndex = i;
      }
    }
    return minIndex;
  };

  /**
   * 组装每一个块块的左上两个方向的偏移量
   * @param height 元素高度
   * @param hArr 页面中各列元素高度数组
   * @param avegOffset 平均向左偏移量
   * @returns 返回当前元素的[左偏移量，顶偏移量]
   */
  const handleLeftandTopOffset = (
    height=200,
    hArr =[],
    width=180,
    avegOffset=180,
  ) => {
    // 左left | 顶top
    const LeftandTop = [0, 0];
    const minIndex = minArrIndex(hArr);
    // 每个盒子的宽度包括间距
    LeftandTop[0] = minIndex * width + (minIndex + 1) * avegOffset;

    LeftandTop[1] = hArr[minIndex];
    hArr[minIndex] += height;

    return {
      minIndex,
      offset: {
        left: LeftandTop[0],
        top: LeftandTop[1],
      },
    };
  };
  // 根据给出的范围计算最合适的item宽度
  const handleSuitableWidth = (width=180) => {
    // 计算屏幕所能容纳的最大item个数
    const count = Math.floor(containerWidth / width);
    return [count, Math.floor((containerWidth % width) / (count + 1))];
  };

  // 初始化方法，
  const initializeMethod = () => {
    // 默认item宽度
    let defaultWidth = itemWidth;
    // 初始偏移量
    let averageOffset = handleSuitableWidth(defaultWidth)[1];
    // 判断间隙是否超过所给的参数
    while (averageOffset > maxSpace && defaultWidth < itemMaxWidth) {
      defaultWidth += 5;
      averageOffset = handleSuitableWidth(defaultWidth)[1];
    }

    const maxCount = handleSuitableWidth(defaultWidth);
    // setMaxcount(maxCount[0]);
    const initHeightArray = Array(maxCount[0]).fill(0);

    const newData = [];
    // 纵向排序数据
    const VSData = Array(maxCount[0])
      .fill(null)
      .map(() => []);

    overallData.forEach((value, index) => {
      const itemHeight = handleItemHeight(value, defaultWidth);
      const directionalOffset = handleLeftandTopOffset(
        itemHeight,
        initHeightArray,
        defaultWidth,
        averageOffset,
      );
      const item = {
        left: directionalOffset.offset.left,
        top: directionalOffset.offset.top,
        width: defaultWidth,
        height: itemHeight,
        child: value,
      };
      newData.push(item);
      VSData[directionalOffset.minIndex].push(item);
    });
    if (handleThrowData) {
      handleThrowData({ maxHeight: max(initHeightArray) });
    }
    if (containerRef.current && VSData.length) {
      let scrollTop = containerRef.current.scrollTop;
      if (isDefaultBottom) {
        // 找到现在最高的列
        scrollTop = max(initHeightArray) - containerHeight;
      }
      // 变化可渲染区域的数据
      getVisibleData(VSData, scrollTop);
    }
    setRenderData(newData);
    setVerticalSortingData(VSData);
    // setHeightArr(initHeightArray);
  };

  // 找出显示在屏幕区域的数据
  const getVisibleData = (data, scrollTop) => {
    const visibleData = [];
    // 遍历数据，判断每个元素是否出现在屏幕范围内
    data.forEach((column=[]) => {
      let accumulatedHeight = 0;
      column.forEach((item) => {
        // 确保当前元素在视窗范围内
        if (
          (accumulatedHeight + item.height > scrollTop &&
            accumulatedHeight < scrollTop + containerHeight) ||
          (accumulatedHeight < scrollTop + containerHeight &&
            accumulatedHeight + item.height > scrollTop)
        ) {
          visibleData.push(item);
        }
        accumulatedHeight += item.height;
      });
    });
    setVisualAreaData(visibleData);
  };

  // 滚动事件
  const handleScroll = () => {
    if (containerRef.current && verticalSortingData?.length) {
      const scrollTop = containerRef.current.scrollTop;
      // 变化可渲染区域的数据
      getVisibleData(verticalSortingData, scrollTop);
    }
  };

  useEffect(() => {
    initializeMethod();
  }, [overallData]);

  useEffect(() => {
    if (containerRef.current && renderData) {
      containerRef.current.addEventListener('scroll', handleScroll);
      return () => {
        // 在组件卸载时移除事件监听
        if (containerRef.current) {
          containerRef.current.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [renderData]);

  useEffect(() => {
    if (visualAreaData && isDefaultBottom) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visualAreaData, overallData]);

  return (
    <div
      style={{
        height: `${containerHeight}px`,
        width: `${containerWidth}px`,
      }}
    >
      {visualAreaData &&
        visualAreaData.map((item, index) => {
          return handleChildElement(item, index);
        })}
    </div>
  );
};

export default VirtualWaterList;
