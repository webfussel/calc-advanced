const isNumOrDot = (value: string) => !isNaN(+value) || value === '.'
const isOperation = (value: string) => ['+', '-', '*', '/'].includes(value)
const canAddCharacter = (value: string) => {
    const prevValue = CALCULATION.at(-1) ?? ''
    if (prevValue === '' && !isOperation(value) && value !== '.') return true
    if (prevValue === '' && (isOperation(value) || value === '.')) return false
    if (value === '.' && prevValue.includes('.')) return false
    if (isNumOrDot(value) && isNumOrDot(prevValue)) return true
    return !(isOperation(value) && isOperation(prevValue));

}

const DISPLAY : Record<string, HTMLSpanElement> = {
    calculation: document.querySelector<HTMLSpanElement>('#calculation_label')!,
    result: document.querySelector<HTMLSpanElement>('#result')!,
}

let RES = null
const CALCULATION : string[] = []
;[...document.querySelectorAll<HTMLButtonElement>('#buttons [data-value]')].forEach((button) => {
    const value = button.dataset.value!
    button.addEventListener('click', () => {
        const prevValue = CALCULATION.at(-1)
        if (prevValue === 'RES') {
            if (!isNaN(+value)) {
                CALCULATION.length = 0
                DISPLAY.calculation.innerHTML = '&nbsp;'
                RES = null
            }

            if (isOperation(value)) {
                DISPLAY.calculation.innerText = 'RES'
            }
        }
        if (!canAddCharacter(value)) return
        if (!(isNumOrDot(value) && isNumOrDot(prevValue ?? ''))) DISPLAY.calculation.innerHTML += '&nbsp;'

        DISPLAY.calculation.innerText += `${button.innerText}`
        DISPLAY.calculation.innerHTML = DISPLAY.calculation.innerHTML.replace(/(^&nbsp;)|(&nbsp;$)/g, ' ')

        if (isNumOrDot(value) && prevValue !== undefined && isNumOrDot(prevValue)) {
            CALCULATION[CALCULATION.length - 1] += value
        } else {
            CALCULATION.push(value)
        }
        console.log(CALCULATION)
    })
})

document.querySelector('#buttons [data-operation="CALCULATE"]')?.addEventListener('click', () => {
    const result = eval(CALCULATION.join(''))
    DISPLAY.result.innerText = result.toString()
    CALCULATION.length = 0
    CALCULATION.push('RES')
    RES = result
})

document.querySelector('#buttons [data-operation="CLEAR"]')?.addEventListener('click', () => {
    CALCULATION.length = 0
    DISPLAY.calculation.innerHTML = '&nbsp;'
})

document.querySelector('#buttons [data-operation="CLEAR-EVERYTHING"]')?.addEventListener('click', () => {
    CALCULATION.length = 0
    DISPLAY.calculation.innerHTML = '&nbsp;'
    DISPLAY.result.innerText = '0'
})
