import React, { FC } from 'react';
import { Result, Ok, Err } from 'ts-results';

type Validator<T> = (t: T) => Result<void, string>;

interface IHubInputProps<T> {
    name: string;
    component: FC<T>;
    defaultProps: Partial<T>;
    useRef: boolean;
    validator?: Validator<Partial<T>>;
}

export default class Hub {
    map: Map<string, any>;

    constructor() {
        this.map = new Map();
    }

    public register<T>({
        name,
        component,
        defaultProps,
        validator,
        useRef,
    }: IHubInputProps<T>) {
        // 大小写无关
        const finalType = name.toLowerCase();
        this.map.set(finalType, [component, defaultProps, useRef, validator]);
    }

    public query(name: string): Result<boolean, string> {
        // 大小写无关
        const finalType = name.toLowerCase();
        const value = this.map.get(finalType);
        if (!value) {
            return Err(`${name}未注册`);
        }
        return Ok(value[2] as boolean);
    }

    /**
     * access<T>
     */
    public access<T>(
        name: string,
        props?: T,
        children?: React.ReactNode[],
    ): Result<any, string> {
        const finalType = name.toLowerCase();
        const value = this.map.get(finalType);
        if (!value) {
            return Err(`${name}未注册`);
        }

        const [component, defaultProps, useRef, validator]: [
            FC<T>,
            Partial<T>,
            boolean,
            Validator<Partial<T>>,
        ] = value;

        const props2 = { ...defaultProps, ...props } as T;
        if (validator) {
            const res = validator(props2);
            if (res.err) {
                return Err(res.val);
            }
        }
        return Ok(React.createElement(component, props2, children));
    }
}
