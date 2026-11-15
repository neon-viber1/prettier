test.describe('VS Code with Prettier and editor.formatOnPaste true', () => {
  test('The cut-and-paste issue demo', async () => {<<<PRETTIER_RANGE_START>>>
    // Cut and paste the lines back triggers the semicolon issue
    const something = 'something'
    console.log(something)<<<PRETTIER_RANGE_END>>>
  })
})
