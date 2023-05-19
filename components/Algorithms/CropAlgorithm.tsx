import { FC } from 'react';
import { Heading } from '@chakra-ui/react';

enum Operation {
  skip = 'skip',
  delete = 'delete',
  insert = 'insert',
}

const CropAlgorithm: FC = () => {
  // The function will take in a string for the stale file contents, a string containing the latest file contents, and a JSON string containing the operations. Your function should validate that the sequence of operations, when applied to the stale contents, produces the latest contents. If it does not, or if the sequence of operations is invalid, your function should return false.
  const isValid = (stale: string, latest: string, otjson: string): boolean => {
    // this is the part you will write!
    const operations: [{ op: string; count: number; chars: string }] = JSON.parse(otjson);
    if (!operations.length) return stale === latest;

    let cursorPosition = 0;

    operations.forEach(({ op, count, chars }) => {
      switch (op) {
        // Sets cursor to current cursor position + count
        case Operation.skip:
          cursorPosition += count;
          break;

        // Delete operation deletes <count> amount of characters
        case Operation.delete:
          stale = stale.slice(0, cursorPosition) + stale.slice(cursorPosition + count);
          break;

        case Operation.insert:
          stale = chars + stale.slice();
          cursorPosition += chars.length;
          break;
      }
    });

    return stale === latest && cursorPosition <= stale.length;
  };

  // Test cases
  console.log(
    'test case 1 (should be true):',
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations.',
      '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}]',
    ),
  ); // true

  console.log(
    'test case 2 (should be false):',
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations.',
      '[{"op": "skip", "count": 45}, {"op": "delete", "count": 47}]',
    ),
  ); // false, delete past end

  console.log(
    'test case 3 (should be false):',
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations.',
      '[{"op": "skip", "count": 40}, {"op": "delete", "count": 47}, {"op": "skip", "count": 2}]',
    ),
  ); // false, skip past end

  console.log(
    'test case 4 (should be true):',
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'We use operational transformations to keep everyone in a multiplayer repl in sync.',
      '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]',
    ),
  ); // true
  //
  console.log(
    'test case 5 (should be false):',
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'We can use operational transformations to keep everyone in a multiplayer repl in sync.',
      '[{"op": "delete", "count": 7}, {"op": "insert", "chars": "We"}, {"op": "skip", "count": 4}, {"op": "delete", "count": 1}]',
    ),
  ); // false

  console.log(
    'test case 6 (should be true):',
    isValid(
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      'Repl.it uses operational transformations to keep everyone in a multiplayer repl in sync.',
      '[]',
    ),
  ); // true

  return (
    <>
      <Heading>Algorithms</Heading>
    </>
  );
};

export default CropAlgorithm;