import getParentKeys from 'share/util/getParentKeys'
import formatTreeData from 'share/util/formatTreeData'

describe('util/getParentKeys', () => {
  it('parent keys', () => {
    const data = formatTreeData(
      [
        {
          k: 1,
          title: 'a',
          children: [
            {
              k: 2,
              title: 'a',
              children: [
                {
                  k: 3,
                  title: 'a',
                },
              ],
            },
          ],
        },
      ],
      'k',
      'title',
    )
    expect(getParentKeys(data[0].children[0].children[0])).toEqual(['2', '1'])
  })

  it('节点为空时返回空数组', () => {
    expect(getParentKeys()).toEqual([])
  })

  it('可制定其他键名', () => {
    const parent = { id: 111 }
    const child = { id: 2, parent }
    expect(getParentKeys(child)).toEqual([])
    expect(getParentKeys(child, 'id')).toEqual([111])
  })
})
