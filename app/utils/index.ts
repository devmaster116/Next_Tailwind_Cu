export const getShrinkName = (firstName: string, lastName: string) => {
    const _rename = firstName.slice(0, 1).toUpperCase() + lastName.slice(0, 1).toUpperCase()
    return _rename
}