import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

interface Crop {
  name: string;
  cost: number;
  sell: number;
  grow?: number;
  netProfit?: number;
}

const CropAlgorithm: FC = () => {
  const crops: Crop[] = [
    {
      name: 'cauliflower',
      cost: 25,
      sell: 5,
      grow: 7,
    },
    {
      name: 'banana',
      cost: 30,
      sell: 3,
      grow: 6,
    },
    {
      name: 'potato',
      cost: 20,
      sell: 2,
      grow: 5,
    },
    {
      name: 'carrot',
      cost: 26,
      sell: 6,
      grow: 3,
    },
    {
      name: 'cauliflower',
      cost: 3,
      sell: 1,
      grow: 2,
    },
  ];

  const cropProfitCalc = (wallet: number, crops: Crop[]): number => {
    const n = crops.length;
    const dp = Array.from({ length: wallet + 1 }, () => Array(n).fill(0));

    for (let i = 1; i < wallet + 1; i++) {
      for (let j = 0; j < n; j++) {
        if (crops[j].cost <= i) {
          dp[i][j] = Math.max(
            dp[i][j - 1] ? dp[i][j - 1] : 0,
            dp[i - crops[j].cost][j] + crops[j].sell,
          );
        } else {
          dp[i][j] = dp[i][j - 1] ? dp[i][j - 1] : 0;
        }
      }
    }

    return dp[wallet][n - 1];
    // return [];
  };

  const cropProfitCalc2 = (wallet: number, crops: Crop[]): Crop[] => {
    const purchasedCrops: Crop[] = [];
    const profit = 0;
    const cropScores = crops.reduce<Crop[]>((newArray, { name, cost, sell }) => {
      const netProfit = cost - sell;
      newArray.push({ name, cost, sell, netProfit });
      return newArray;
    }, []);

    cropScores.sort((a, b): number => {
      if (a.netProfit && b.netProfit) {
        if (a.netProfit > b.netProfit) return 1;
        if (a.netProfit < b.netProfit) return -1;
      }
      return 0;
    });

    cropScores.forEach(crop => {
      while (wallet > 0 && wallet > crop.cost) {
        wallet -= Math.floor(wallet / crop.cost);
        purchasedCrops.push(crop);
      }
    });

    console.log(profit);
    return purchasedCrops;
  };

  // console.log(cropProfitCalc2([25, 30, 20, 26, 3], [5, 3, 2, 6, 1], 100));
  // console.log(cropProfitCalc(100, crops));
  // console.log(cropProfitCalc2(100, crops));

  return (
    <>
      <Heading>Algorithms</Heading>
    </>
  );
};

export default CropAlgorithm;