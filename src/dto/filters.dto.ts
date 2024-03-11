export enum FilterCondition {
	Equals = 'equals',
	DoesNotEqual = 'does_not_equal',
	GreaterThan = 'greater_than',
	LessThan = 'less_than',
}
export interface FilterClauseType {
	id: string;
	condition: FilterCondition;
	value: number | string;
}