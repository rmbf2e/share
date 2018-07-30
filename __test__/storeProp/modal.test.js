import modal from 'storeProp/modal'

describe('storeProp/modal', () => {
  class A {
    constructor() {
      modal.call(this, [
        {
          name: 'promotion',
        },
      ])
    }
  }
  const a = new A()

  it('test define modal', () => {
    expect(a.promotionModal).toBe(false)
  })

  it('show/hide modal', () => {
    a.showPromotionModal()
    expect(a.promotionModal).toBe(true)
    a.hidePromotionModal()
    expect(a.promotionModal).toBe(false)
  })

  it('直接用字符串作为参数，不使用对象', () => {
    class B {
      constructor() {
        modal.call(this, ['promotion'])
      }
    }
    const b = new B()

    b.showPromotionModal()
    expect(b.promotionModal).toBe(true)
    b.hidePromotionModal()
    expect(b.promotionModal).toBe(false)
  })
})
