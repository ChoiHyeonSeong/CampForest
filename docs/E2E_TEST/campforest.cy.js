describe('CampForest 기본 테스트', () => {
    it('CampForest 접속', () => {
      cy.visit('https://i11d208.p.ssafy.io')
    })
  
    it(`로그인 & 로그아웃 테스트`, () => {
      cy.visit('https://i11d208.p.ssafy.io/user/login')
      cy.get('form > :nth-child(1) > .w-\\[100\\%\\]').type('user1@test.com')
      cy.get('#password').type('12345')
      cy.get('form > .bg-light-black').click()
      
      cy.wait(3000)
  
      cy.get('.justify-end > :nth-child(2)').click()
      cy.get('.relative > .flex > .px-\\[1rem\\]').click()
    })
  })
  
  describe('CampForest 게시글 테스트', () => {
    beforeEach(`사용자 로그인`, () => {
      cy.viewport(1920, 1080)
      cy.visit('https://i11d208.p.ssafy.io/user/login')
      cy.get('form > :nth-child(1) > .w-\\[100\\%\\]').type('user1@test.com')
      cy.get('#password').type('12345')
      cy.get('form > .bg-light-black').click()
      
      cy.wait(3000)
    })
  
    it(`게시글 작성 테스트`, () => {
      cy.viewport(1920, 1080)
      cy.get('.relative > .z-\\[10\\]').click()
      cy.get('.bottom-\\[4rem\\] > .relative > .absolute').click()
  
      cy.get('.flex-col > .bg-light-white').type('테스트 제목입니다.')
      cy.get('.md\\:w-\\[45rem\\] > :nth-child(1) > .flex-col > .flex-grow').type('테스트 내용입니다.')
      cy.wait(1000)
  
      cy.get('button').last().click({force: true})
    })
  
    it(`게시글 좋아요 & 좋아요 취소 테스트`, () => {
      cy.viewport(1920, 1080)
      cy.get('[data-testid="e2e-boardheart"]').eq(0).click({force: true})
      cy.wait(1000)
      cy.get('[data-testid="e2e-boardheart"]').eq(0).click({force: true})
      cy.wait(1000)
    })
  
    it(`게시글 저장 & 저장 취소 테스트`, () => {
      cy.viewport(1920, 1080)
      cy.get('[data-testid="e2e-boardsave"]').eq(0).click({force: true})
      cy.wait(1000)
      cy.get('[data-testid="e2e-boardsave"]').eq(0).click({force: true})
      cy.wait(1000)
    })
  
    it(`게시글 댓글 작성, 좋아요, 삭제 테스트`, () => {
      cy.viewport(1920, 1080)
      cy.get('[data-testid="e2e-boardcomment-1"]').eq(0).click({force: true})
      cy.get('[data-testid="e2e-boardcomment-2"]').type('테스트 댓글입니다.')
      cy.get('[data-testid="e2e-boardcomment-3"]').click({force: true})
      cy.wait(1000)
      cy.get('[data-testid="e2e-boardcomment-4"]').eq(0).click({force: true})
      cy.wait(2000)
      cy.get('[data-testid="e2e-boardcomment-5"]').click({force: true})
      cy.wait(1000)
    })
  
    it(`게시글 삭제 테스트`, () => {
      cy.viewport(1920, 1080)
      cy.get('[data-testid="delete-1"]').eq(0).click({force: true})
      cy.get('[data-testid="delete-2"]').eq(0).click({force: true})
      cy.visit('https://i11d208.p.ssafy.io')
    })
  })
  
  describe('CampForest 사용자 팔로우 테스트', () => {
    beforeEach(`사용자 로그인`, () => {
      cy.viewport(1920, 1080)
      cy.visit('https://i11d208.p.ssafy.io/user/login')
      cy.get('form > :nth-child(1) > .w-\\[100\\%\\]').type('user1@test.com')
      cy.get('#password').type('12345')
      cy.get('form > .bg-light-black').click()
      
      cy.wait(3000)
    })
  
    it(`사용자 검색 & 팔로우 테스트`, () => {
      cy.viewport(1920, 1080)
      cy.visit('https://i11d208.p.ssafy.io')
      cy.get('[data-testid="searchuser-1"]').click()
      cy.get('[data-testid="searchuser-2"]').type('효자동')
      cy.get('[data-testid="searchuser-3"]').click()
      cy.wait(2000)
      cy.get('.me-\\[0\\.5rem\\] > [data-testid="searchuser-4"]').click({force: true})
      cy.wait(1000)
    })
  
    it(`사용자 검색 & 언팔로우 테스트`, () => {
      cy.viewport(1920, 1080)
      cy.visit('https://i11d208.p.ssafy.io')
      cy.get('[data-testid="searchuser-1"]').click()
      cy.get('[data-testid="searchuser-2"]').type('효자동')
      cy.get('[data-testid="searchuser-3"]').click()
      cy.wait(2000)
      cy.get('.me-\\[0\\.5rem\\] > [data-testid="searchuser-4"]').click({force: true})
      cy.wait(1000)
    })
  })