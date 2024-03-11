import axios, { AxiosRequestConfig } from 'axios';
import envConfig from '../config';
import { logger } from '../logger/index';
import { FilterClauseType, FilterCondition } from '../dto/filters.dto';
import { PageOptions, PaginatedResponse, QuestionType, RequestOptions } from '../dto/response.dto'

/**
 * Represents an API service for fetching and filtering form submission data.
 * This service allows for interaction with an external API to retrieve form submissions,
 * which can then be filtered based on specific criteria. It supports pagination of the
 * filtered results, making it suitable for handling large datasets efficiently.
 *
 * Methods:
 * - fetchFormSubmissionData: Asynchronously fetches form submission data from an external API,
 *   allowing for optional request customization through headers and query parameters.
 * - filterResponses: Applies specified filter criteria to the fetched form submission data and
 *   returns a paginated response, facilitating the handling of large datasets by breaking them
 *   into manageable chunks.
 */
class ApiService {
    private apiEndpoint: string;

    constructor() {
        this.apiEndpoint = envConfig.apiUrl;
    }

    /**
     * Fetches form submission data from an external API.
     * @param options - The options for the API request.
     * @returns A promise that resolves to the paginated response containing the form submission data.
     * @throws An error if there is an issue fetching the data from the external API.
     */
    async fetchFormSubmissionData<Q>(options?: RequestOptions<Q>): Promise<PaginatedResponse> {
        try {
            const config: AxiosRequestConfig = {
                headers: { ...options.headers || {}, Authorization: `Bearer ${envConfig.externalApiToken}` },
                params: options.queryParams || {},
            };
            const requestUrl = this.apiEndpoint + `${options.formId}/submissions`
            const response = await axios.get(requestUrl, config);
            return response.data;
        } catch (error) {
            logger.error(JSON.stringify(error))
            throw new Error(`Error fetching data from external API: ${error.message}`);
        }
    }

    /**
     * Represents an API service for fetching and filtering form submission data.
     * This service allows for interaction with an external API to retrieve form submissions,
     * which can then be filtered based on specific criteria. It supports pagination of the
     * filtered results, making it suitable for handling large datasets efficiently.
     *
     * Methods:
     * - fetchFormSubmissionData: Asynchronously fetches form submission data from an external API,
     *   allowing for optional request customization through headers and query parameters.
     * - filterResponses: Applies specified filter criteria to the fetched form submission data and
     *   returns a paginated response, facilitating the handling of large datasets by breaking them
     *   into manageable chunks.
     */
    paginatedResponse(pageOptions: PageOptions, flatFilteredResponses: any): PaginatedResponse {
        // Pagination logic
        const page = parseInt(pageOptions.page as string, 10) || 1;
        const pageSize = parseInt(pageOptions.pageSize as string, 10) || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedResponses = flatFilteredResponses.slice(startIndex, endIndex);
        return {
            responses: paginatedResponses,
            totalResponses: flatFilteredResponses.length,
            pageCount: Math.ceil(flatFilteredResponses.length / pageSize),
        };
    }

    /**
     * Applies specified filter criteria to the fetched form submission data and returns a paginated response,
     * facilitating the handling of large datasets by breaking them into manageable chunks.
     * @param response - The paginated response containing the form submission data.
     * @param filters - The filter criteria to apply to the form submission data.
     * @param pageOptions - The options for pagination of the filtered results.
     * @returns A paginated response containing the filtered form submission data.
     */
    filterResponses(response: PaginatedResponse, filters: FilterClauseType[], pageOptions: PageOptions): PaginatedResponse {
        // Apply filters
        if (filters && filters.length > 0) {
            const filteredResponses = response.responses
                .map((responseItem) => {
                    const filteredQuestions: QuestionType[] = responseItem.questions
                        .filter((question) => {
                            return filters.some((filter) => {
                                if (question.id === filter.id) {
                                    switch (filter.condition) {
                                        case FilterCondition.Equals:
                                            return question.value === filter.value;
                                        case FilterCondition.DoesNotEqual:
                                            return question.value !== filter.value;
                                        case FilterCondition.GreaterThan:
                                            return Number(question.value) > Number(filter.value);
                                        case FilterCondition.LessThan:
                                            return Number(question.value) < Number(filter.value);
                                        default:
                                            return false;
                                    }
                                }
                                return false; // Exclude non-matching questions
                            });
                        })
                        .filter((filteredQuestion) => filteredQuestion !== null);

                    return filteredQuestions.length > 0 ? {
                        submissionId: responseItem.submissionId,
                        submissionTime: responseItem.submissionTime,
                        lastUpdatedAt: responseItem.lastUpdatedAt,
                        questions: filteredQuestions,
                        calculations: responseItem.calculations || [],
                        urlParameters: responseItem.urlParameters || [],
                        quiz: responseItem.quiz || {},
                        documents: responseItem.documents || []
                    } : null;
                })
                .filter((filteredResponse) => filteredResponse !== null);

            // Flatten the array of arrays into a single array
            const flatFilteredResponses = [].concat(...filteredResponses);

            // paginating out filtered data.
            return this.paginatedResponse(pageOptions, flatFilteredResponses)
        }
        return response;
    }
}

export default ApiService;