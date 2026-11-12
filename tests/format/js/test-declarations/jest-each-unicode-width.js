it.each`
    input                                          | someArray
    ${'Letters only äÄöÖüÜß'}                      | ${['A', 'B', 'C', 'D', 'E']}
    ${'Letters äÄöÖüÜß And 1+2&3~` And ©®'}        | ${['B', 'C', 'D', 'E']}
    ${'Letters äÄöÖüÜß And 1+2&3~` And ©® And ™'}  | ${['D', 'E']}
    ${'tab\tCR\\r\\nnewline'}                        | ${['C', 'E']}
    ${'emoji 🩲'}                                  | ${[]}
    ${'whatever this is (❁´◡`❁)'}                  | ${[]}
  `('should test input "$input" correctly for each datatype', ({ input, someArray }) => {
    expect(true);
  });
