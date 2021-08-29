// arr1 是否包含 所有arr2的数据
// 没有测试过，暂时不启用
export function array_contains<T>(arr1: T[], arr2: T[]): boolean {
    const arr1_length = arr1.length;
    const arr2_length = arr2.length;

    if (arr2_length > arr1_length) {
        return false;
    }
    arr1.sort();
    arr2.sort();

    // 如果arr2第一个值比arr1第一个值小，或arr2最后一个值比arr1最后一个值大
    // arr1:[2,3,5,7], arr2:[1,3,8], [3,4,5]
    if (arr2[0] < arr1[0] || arr2[arr2_length - 1] > arr1[arr1_length - 1]) {
        return false;
    }
    let arr1_index = 0;
    let arr2_index = 0;

    while (arr2_index < arr2_length && arr1_index < arr1_length) {
        if (arr2[arr2_index] > arr1[arr1_index]) {
            arr1_index++;
        } else if (arr2[arr2_index] < arr1[arr1_index]) {
            return false;
        } else {
            arr1_index++;
            arr2_index++;
        }
    }
    return true;
}
