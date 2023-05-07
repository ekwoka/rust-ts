import {filter} from '@/iterators/filter';

describe('filter', () => {
    it('filters an iterable', () =>
        expect([...filter([1, 2, 3], x => x % 2 === 0)]).toEqual([2])
    )
})