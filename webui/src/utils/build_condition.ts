import { IDict } from '@/models/dicts/dicts';

// 对搜索条件进行编码成SQL
export function buildCondition(
    dicts: IDict[],
    values: Record<string, any>,
): string[] {
    const conds = [];

    const {
        admit_time_range,
        discharge_time_range,
        rate_range,
        bring_with,
        tags,
        ...others
    } = values;

    if (admit_time_range) {
        // todo: 是否有边界问题
        conds.push(
            `admit_time BETWEEN '${admit_time_range[0].format(
                'YYYY-MM-DD',
            )}' AND '${admit_time_range[1]
                .add(1, 'day')
                .format('YYYY-MM-DD')}'`,
        );
    }

    if (discharge_time_range) {
        conds.push(
            `discharge_time BETWEEN '${discharge_time_range[0].format(
                'YYYY-MM-DD',
            )}' AND '${discharge_time_range[1]
                .add(1, 'day')
                .format('YYYY-MM-DD')}'`,
        );
    }

    if (rate_range && !(rate_range[0] === 0 && rate_range[1] === 5)) {
        conds.push(`rate >= ${rate_range[0]} AND rate <= ${rate_range[1]}`);
    }

    if (Array.isArray(bring_with) && bring_with.length > 0) {
        conds.push(`bring_with @> ARRAY['${bring_with.join("','")}']`);
    }

    if (Array.isArray(tags) && tags.length > 0) {
        conds.push(build_dict_condition(dicts, tags, '标签', 'tags'));
    }

    build_conditions(conds, others);

    return conds;
}

export function build_conditions(conds: string[], values: Record<string, any>) {
    for (const [key, value] of Object.entries(values)) {
        if (typeof value === 'string' && value !== '') {
            conds.push(`${key} = '${value}'`);
        } else if (Array.isArray(value)) {
            conds.push(`${key} @> ARRAY[${value.join(',')}]`);
        } else if (typeof value === 'number') {
            conds.push(`${key} = '${value}'`);
        }
    }
}

// 查找字典中存在后代的项，
export function build_dict_condition(
    dicts: IDict[],
    params: number[],
    category: string,
    column: string,
): string {
    const conds = [];
    const filted_dicts = dicts.filter(({ category: c }) => c === category);

    for (const param of params) {
        const set = new Set<number>();
        set.add(param);
        find_descendants(set, param, filted_dicts);
        conds.push(
            // postgres 数组语法: name && [1,2,3] 相交就行，表示只要和一个匹配就可以
            `${column} && ARRAY[${Array.from(set.values()).join(',')}]::INT[]`,
        );
    }
    return conds.join(' AND ');
}

// 递归查找后代
function find_descendants(set: Set<number>, id: number, dicts: IDict[]) {
    const fathers = dicts
        .filter(({ father_id }) => father_id === id)
        .map(({ id }) => {
            set.add(id);
            return id;
        });

    for (const father of fathers) {
        find_descendants(set, father, dicts);
    }
}
