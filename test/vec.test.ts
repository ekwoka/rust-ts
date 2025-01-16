import { Vec2, Vec3 } from '@/vec'
describe('Vec2', () => {
  describe('static methods', () => {
    it.each([
      ['5,7', 5, 7],
      [[42, 69], 42, 69],
      [['7', '8'], 7, 8],
      [
        {
          'this is': 'an iterable',
          [Symbol.iterator]: () => [11, 12][Symbol.iterator](),
        },
        11,
        12,
      ],
    ])('Vec2.from(%o) is a Vec2(%d, %d)', (input, x, y) => {
      expect(Vec2.from(input as string)).toEqual(new Vec2(x, y))
    })
    it('Vec2.fromAngle', () => {
      expect(toFixed(Vec2.fromAngle(30), 3)).toEqual(new Vec2(0.866, 0.5))
    })
    it.each([
      ['ZERO', 0, 0],
      ['ONE', 1, 1],
      ['NEG_ONE', -1, -1],
      ['MIN', Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER],
      ['MAX', Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
      ['INFINITY', Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
      ['NEG_INFINITY', Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      ['NaN', Number.NaN, Number.NaN],
      ['X', 1, 0],
      ['Y', 0, 1],
      ['NEG_X', -1, 0],
      ['NEG_Y', 0, -1],
    ] as const)('Vec2.%s is a Vec2 with %d, %d', (method, x, y) => {
      expect(Vec2[method as keyof Vec2]).toEqual(new Vec2(x, y))
    })

    it.each([(Math.random() * 200) | 0])(
      'splat %d as n to Vec2(n, n))',
      (n) => {
        expect(Vec2.splat(n)).toEqual(new Vec2(n, n))
      },
    )

    it('Selects new Vec2 from multiple Vecs with Mask', () => {
      expect(Vec2.select(Vec2.Y, Vec2.splat(55), Vec2.splat(99))).toEqual(
        new Vec2(99, 55),
      )
    })
  })
  describe('instance methods', () => {
    describe('Math operations', () => {
      it('Vec2#add', () => {
        expect(Vec2.X.add(Vec2.Y)).toEqual(Vec2.ONE)
      })
      it('Vec2#sub', () => {
        expect(Vec2.ONE.sub(Vec2.Y)).toEqual(Vec2.X)
      })
      it('Vec2#mult', () => {
        expect(Vec2.NEG_ONE.mult(Vec2.Y)).toEqual(new Vec2(-0, -1))
      })
      it('Vec2#div', () => {
        expect(Vec2.splat(42).div(new Vec2(6, 2))).toEqual(new Vec2(7, 21))
      })
      it('Vec2#min', () => {
        expect(Vec2.splat(42).min(new Vec2(69, 32))).toEqual(new Vec2(42, 32))
      })
      it('Vec2#max', () => {
        expect(Vec2.splat(42).max(new Vec2(69, 32))).toEqual(new Vec2(69, 42))
      })
      it('Vec2#clamp', () => {
        expect(new Vec2(42, 69).clamp(Vec2.ZERO, Vec2.splat(50))).toEqual(
          new Vec2(42, 50),
        )
      })
      it('Vec2#abs', () => {
        expect(new Vec2(-42, 69).abs()).toEqual(new Vec2(42, 69))
      })
      it('Vec2#ceil', () => {
        expect(new Vec2(42.1, 69.9).ceil()).toEqual(new Vec2(43, 70))
      })
      it('Vec2#floor', () => {
        expect(new Vec2(42.1, 69.9).floor()).toEqual(new Vec2(42, 69))
      })
      it('Vec2#round', () => {
        expect(new Vec2(42.1, 69.9).round()).toEqual(new Vec2(42, 70))
      })
    })
    describe('Vector operations', () => {
      it('Vec2#scale', () => {
        expect(Vec2.ONE.scale(5)).toEqual(Vec2.splat(5))
      })
      it('Vec2#dot', () => {
        expect(Vec2.splat(2).dot(Vec2.splat(5))).toBe(20)
      })
      it('Vec2#length', () => {
        expect(new Vec2(42, 69).length()).toBeCloseTo(80.777)
      })
      it('Vec2#normalize', () => {
        expect(new Vec2(42, 69).normalize()).toEqual(
          new Vec2(0.5199469468957453, 0.8541985556144386),
        )
        expect(new Vec2(42, 69).normalize().length()).toBeCloseTo(1)
      })
      it('Vec2#projectOnto', () => {
        expect(
          toFixed(new Vec2(4, 7).projectOnto(Vec2.fromAngle(30)), 3),
        ).toEqual(new Vec2(6.031, 3.482))
      })
      it('Vec2#rejectFrom', () => {
        expect(
          toFixed(new Vec2(4, 7).rejectFrom(Vec2.fromAngle(30)), 3),
        ).toEqual(new Vec2(-2.031, 3.518))
      })
      it('Vec2#distance', () => {
        expect(Number(new Vec2(3, 4).distance(Vec2.NEG_X).toFixed(3))).toBe(
          5.657,
        )
      })
      it('Vec2#midPoint', () => {
        expect(new Vec2(39, 60).midPoint(new Vec2(45, 78))).toEqual(
          new Vec2(42, 69),
        )
      })
      it('Vec2#moveTowards', () => {
        expect(new Vec2(50, 100).moveTowards(Vec2.ZERO, 10)).toEqual(
          new Vec2(45, 90),
        )
        expect(new Vec2(50, 100).moveTowards(Vec2.ZERO, 110)).toEqual(Vec2.ZERO)
        expect(new Vec2(50, 100).moveTowards(Vec2.ZERO, -10)).toEqual(
          new Vec2(50, 100),
        )
      })
      it('Vec2#lerp', () => {
        expect(new Vec2(50, 100).lerp(Vec2.ZERO, 10)).toEqual(new Vec2(45, 90))
        expect(new Vec2(50, 100).lerp(Vec2.ZERO, 110)).toEqual(
          new Vec2(-5, -10),
        )
        expect(new Vec2(50, 100).lerp(Vec2.ZERO, -10)).toEqual(
          new Vec2(55, 110),
        )
      })
    })
    describe('Vec2#to*', () => {
      it('Array', () => {
        expect(Vec2.X.toArray()).toEqual([1, 0])
      })
      it('String', () => {
        expect(Vec2.X.toString()).toEqual('1,0')
      })
      it('Iter', () => {
        expect([...Vec2.X.toIter()]).toEqual([1, 0])
      })
      it('Angle', () => {
        expect(Vec2.X.toAngle()).toBeCloseTo(0)
        expect(Vec2.fromAngle(30).toAngle()).toBeCloseTo(30)
      })
    })
  })

  describe('Trait calling methods', () => {
    describe('Math operations', () => {
      it('Vec2#add', () => {
        expect(Vec2.add(Vec2.X, Vec2.Y)).toEqual(Vec2.ONE)
      })
      it('Vec2#sub', () => {
        expect(Vec2.sub(Vec2.ONE, Vec2.Y)).toEqual(Vec2.X)
      })
    })
    describe('Vector operations', () => {
      it('Vec2#scale', () => {
        expect(Vec2.scale(5)(Vec2.ONE)).toEqual(Vec2.splat(5))
      })
      it('Vec2#dot', () => {
        expect(Vec2.dot(Vec2.splat(2), Vec2.splat(5))).toBe(20)
      })
      it('Vec2#length', () => {
        expect(Vec2.length(new Vec2(42, 69))).toBeCloseTo(80.777)
      })
      it('Vec2#normalize', () => {
        expect(Vec2.normalize(new Vec2(42, 69))).toEqual(
          new Vec2(0.5199469468957453, 0.8541985556144386),
        )
        expect(Vec2.normalize(new Vec2(42, 69)).length()).toBeCloseTo(1)
      })
      it('Vec2#clamp', () => {
        expect(Vec2.clamp(Vec2.ZERO, Vec2.splat(50))(new Vec2(42, 69))).toEqual(
          new Vec2(42, 50),
        )
      })
    })
    describe('Vec2#to*', () => {
      it('Array', () => {
        expect(Vec2.toArray(Vec2.X)).toEqual([1, 0])
      })
      it('String', () => {
        expect(Vec2.toString(Vec2.X)).toEqual('1,0')
      })
      it('Iter', () => {
        expect([...Vec2.toIter(Vec2.X)]).toEqual([1, 0])
      })
      it('Angle', () => {
        expect(Vec2.toAngle(Vec2.X)).toBeCloseTo(0)
        expect(Vec2.toAngle(Vec2.fromAngle(30))).toBeCloseTo(30)
      })
    })
  })

  describe('vector projection', () => {
    it('projects a vector onto another vector', () => {
      const angle = 30
      const rads = (angle * Math.PI) / 180
      const wallVec = new Vec2(Math.cos(rads), Math.sin(rads))
      const projectedVec = wallVec.scale(new Vec2(4, 7).dot(wallVec))
      expect(
        new Vec2(
          Number(projectedVec.x.toFixed(3)),
          Number(projectedVec.y.toFixed(3)),
        ),
      ).toEqual(new Vec2(6.031, 3.482))
    })
    it('projects again', () => {
      const onto = new Vec2(2, 8).normalize()
      const from = new Vec2(4, 3)
      const projected = onto.scale(from.dot(onto))
      expect(projected).toEqual(new Vec2(16 / 17, 64 / 17))
    })
  })
})

describe('Vec3', () => {
  describe('static methods', () => {
    it.each([
      ['5,7,9', 5, 7, 9],
      [[42, 69, 180], 42, 69, 180],
      [['7', '8', '9'], 7, 8, 9],
      [
        {
          'this is': 'an iterable',
          [Symbol.iterator]: () => [11, 12, 13][Symbol.iterator](),
        },
        11,
        12,
        13,
      ],
    ])('Vec3.from(%o) is a Vec3(%d, %d)', (input, x, y, z) => {
      expect(Vec3.from(input as string)).toEqual(new Vec3(x, y, z))
    })
    it.each([
      ['ZERO', 0, 0, 0],
      ['ONE', 1, 1, 1],
      ['NEG_ONE', -1, -1, -1],
      [
        'MIN',
        Number.MIN_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ],
      [
        'MAX',
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
      ],
      [
        'INFINITY',
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
        Number.POSITIVE_INFINITY,
      ],
      [
        'NEG_INFINITY',
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
      ],
      ['NaN', Number.NaN, Number.NaN, Number.NaN],
      ['X', 1, 0, 0],
      ['Y', 0, 1, 0],
      ['Z', 0, 0, 1],
      ['NEG_X', -1, 0, 0],
      ['NEG_Y', 0, -1, 0],
      ['NEG_Z', 0, 0, -1],
    ] as const)('Vec3.%s is a Vec3 with %d, %d', (method, x, y, z) => {
      expect(Vec3[method as keyof Vec3]).toEqual(new Vec3(x, y, z))
    })

    it.each([(Math.random() * 200) | 0])(
      'splat %d as n to Vec3(n, n))',
      (n) => {
        expect(Vec3.splat(n)).toEqual(new Vec3(n, n, n))
      },
    )

    it('Selects new Vec3 from multiple Vecs with Mask', () => {
      expect(Vec3.select(Vec3.Y, Vec3.splat(55), Vec3.splat(99))).toEqual(
        new Vec3(99, 55, 99),
      )
    })
  })
  describe('instance methods', () => {
    describe('Math operations', () => {
      it('Vec3#add', () => {
        expect(Vec3.X.add(Vec3.Y).add(Vec3.Z)).toEqual(Vec3.ONE)
      })
      it('Vec3#sub', () => {
        expect(Vec3.ONE.sub(Vec3.Y).sub(Vec3.Z)).toEqual(Vec3.X)
      })
      it('Vec3#mult', () => {
        expect(Vec3.NEG_ONE.mult(Vec3.Y)).toEqual(new Vec3(-0, -1, -0))
      })
      it('Vec3#div', () => {
        expect(Vec3.splat(42).div(new Vec3(6, 2, 1))).toEqual(
          new Vec3(7, 21, 42),
        )
      })
      it('Vec3#min', () => {
        expect(Vec3.splat(42).min(new Vec3(69, 32, 42))).toEqual(
          new Vec3(42, 32, 42),
        )
      })
      it('Vec3#max', () => {
        expect(Vec3.splat(42).max(new Vec3(69, 32, 42))).toEqual(
          new Vec3(69, 42, 42),
        )
      })
      it('Vec3#clamp', () => {
        expect(new Vec3(42, 69, -10).clamp(Vec3.ZERO, Vec3.splat(50))).toEqual(
          new Vec3(42, 50, 0),
        )
      })
      it('Vec3#abs', () => {
        expect(new Vec3(-42, 69, -0).abs()).toEqual(new Vec3(42, 69, 0))
      })
      it('Vec3#ceil', () => {
        expect(new Vec3(42.1, 69.9, 42.5).ceil()).toEqual(new Vec3(43, 70, 43))
      })
      it('Vec3#floor', () => {
        expect(new Vec3(42.1, 69.9, 42.5).floor()).toEqual(new Vec3(42, 69, 42))
      })
      it('Vec3#round', () => {
        expect(new Vec3(42.1, 69.9, 42.5).round()).toEqual(new Vec3(42, 70, 43))
      })
    })
    describe('Vector operations', () => {
      it('Vec3#scale', () => {
        expect(Vec3.ONE.scale(5)).toEqual(Vec3.splat(5))
      })
      it('Vec3#dot', () => {
        expect(Vec3.splat(2).dot(Vec3.splat(5))).toBe(30)
      })
      it('Vec3#length', () => {
        expect(new Vec3(42, 69, 100).length()).toBeCloseTo(128.549)
      })
      it('Vec3#normalize', () => {
        expect(new Vec3(42, 69, 100).normalize()).toEqual(
          new Vec3(0.32672213346545387, 0.5367577906932456, 0.777909841584414),
        )
        expect(new Vec3(42, 69, 100).normalize().length()).toBeCloseTo(1)
      })
      it('Vec3#projectOnto', () => {
        expect(
          toFixed3(new Vec3(4, 7, 5).projectOnto(new Vec3(5, 10, 15)), 3),
        ).toEqual(new Vec3(2.357, 4.714, 7.071))
      })
      it('Vec3#rejectFrom', () => {
        expect(
          toFixed3(new Vec3(4, 7, 5).rejectFrom(new Vec3(5, 10, 15)), 3),
        ).toEqual(new Vec3(1.643, 2.286, -2.071))
      })
      it('Vec3#distance', () => {
        expect(
          Number(new Vec3(3, 4, 5).distance(Vec3.NEG_X).toFixed(3)),
        ).toBeCloseTo(7.55)
      })
      it('Vec3#midPoint', () => {
        expect(new Vec3(39, 60, 10).midPoint(new Vec3(45, 78, 0))).toEqual(
          new Vec3(42, 69, 5),
        )
      })
      it('Vec3#moveTowards', () => {
        expect(new Vec3(50, 100, -100).moveTowards(Vec3.ZERO, 10)).toEqual(
          new Vec3(45, 90, -90),
        )
        expect(new Vec3(50, 100, -100).moveTowards(Vec3.ZERO, 110)).toEqual(
          Vec3.ZERO,
        )
        expect(new Vec3(50, 100, -100).moveTowards(Vec3.ZERO, -10)).toEqual(
          new Vec3(50, 100, -100),
        )
      })
      it('Vec3#lerp', () => {
        expect(new Vec3(50, 100, -100).lerp(Vec3.ZERO, 10)).toEqual(
          new Vec3(45, 90, -90),
        )
        expect(new Vec3(50, 100, -100).lerp(Vec3.ZERO, 110)).toEqual(
          new Vec3(-5, -10, 10),
        )
        expect(new Vec3(50, 100, -100).lerp(Vec3.ZERO, -10)).toEqual(
          new Vec3(55, 110, -110),
        )
      })
    })
    describe('Vec3#to*', () => {
      it('Array', () => {
        expect(Vec3.X.toArray()).toEqual([1, 0, 0])
      })
      it('String', () => {
        expect(Vec3.X.toString()).toEqual('1,0,0')
      })
      it('Iter', () => {
        expect([...Vec3.X.toIter()]).toEqual([1, 0, 0])
      })
    })
  })

  describe('Trait calling methods', () => {
    describe('Math operations', () => {
      it('Vec3#add', () => {
        expect(Vec3.add(Vec3.X, Vec3.Y)).toEqual(new Vec3(1, 1, 0))
      })
      it('Vec3#sub', () => {
        expect(Vec3.sub(Vec3.ONE, Vec3.Y)).toEqual(new Vec3(1, 0, 1))
      })
    })
    describe('Vector operations', () => {
      it('Vec3#scale', () => {
        expect(Vec3.scale(5)(Vec3.ONE)).toEqual(Vec3.splat(5))
      })
      it('Vec3#dot', () => {
        expect(Vec3.dot(Vec3.splat(2), Vec3.splat(5))).toBe(30)
      })
      it('Vec3#length', () => {
        expect(Vec3.length(new Vec3(42, 69, 100))).toBeCloseTo(128.549)
      })
      it('Vec3#normalize', () => {
        expect(Vec3.normalize(new Vec3(42, 69, 100))).toEqual(
          new Vec3(0.32672213346545387, 0.5367577906932456, 0.777909841584414),
        )
        expect(Vec3.normalize(new Vec3(42, 69, 100)).length()).toBeCloseTo(1)
      })
      it('Vec3#clamp', () => {
        expect(
          Vec3.clamp(Vec3.ZERO, Vec3.splat(50))(new Vec3(42, 69, -50)),
        ).toEqual(new Vec3(42, 50, 0))
      })
    })
    describe('Vec3#to*', () => {
      it('Array', () => {
        expect(Vec3.toArray(Vec3.X)).toEqual([1, 0, 0])
      })
      it('String', () => {
        expect(Vec3.toString(Vec3.X)).toEqual('1,0,0')
      })
      it('Iter', () => {
        expect([...Vec3.toIter(Vec3.X)]).toEqual([1, 0, 0])
      })
    })
  })
})

describe('conversion between', () => {
  it('Vec2.from(Vec3)', () => {
    expect(Vec2.from(new Vec3(42, 69, 100))).toEqual(new Vec2(42, 69))
  })
  it('Vec3.from(Vec2)', () => {
    expect(Vec3.from(new Vec2(42, 69))).toEqual(new Vec3(42, 69, 0))
  })
})

const toFixed = (vec: Vec2, n: number) =>
  new Vec2(Number(vec.x.toFixed(n)), Number(vec.y.toFixed(n)))

const toFixed3 = (vec: Vec3, n: number) =>
  new Vec3(
    Number(vec.x.toFixed(n)),
    Number(vec.y.toFixed(n)),
    Number(vec.z.toFixed(n)),
  )
