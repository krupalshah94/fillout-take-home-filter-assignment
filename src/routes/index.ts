import express, { Request, Response } from "express";
import { FilterClauseType } from "../dto/filters.dto";
import ApiService from "../services/externalAPI.service";
import { logger } from "../logger";

/**
 * Registers a route in the Express application to handle a GET request for filtered responses.
 * This route is designed to fetch form submission data based on a given form ID, apply filters to the data,
 * and return a paginated response. The filters and pagination options are received as query parameters.
 * The function extracts these parameters, fetches the data using the ApiService, applies the specified filters,
 * paginates the result, and sends back the filtered and paginated data as a JSON response.
 * @param app - The Express application. This is used to register a new GET route.
 * @returns void - The function does not return a value. Instead, it modifies the Express application by adding a new route.
 */
export const register = (app: express.Application) => {
    app.get("/:formId/filteredResponses", async (req: Request, res: Response) => {
        try {
            // Extract filters from query parameters
            const filtersParam = req.query.filters as string | undefined;
            const page = req.query.page as string | 1;
            const pageSize = req.query.pageSize as string | 10;
            const filters: FilterClauseType[] = filtersParam ? JSON.parse(filtersParam) : [];
            const formId = req.params.formId;
            // Create an instance of ApiService
            const apiService = new ApiService(); // Replace with your actual API endpoint

            // Call fetchData with async/await
            const responseData = await apiService.fetchFormSubmissionData<any[]>({ formId: formId });
            const filteredResponsesWithPagination = apiService.filterResponses(responseData, filters, { page, pageSize });
            res.json(filteredResponsesWithPagination);
        } catch (error) {
            logger.error(JSON.stringify(error));
            res.status(500).json({ error: 'Internal Server Error', message: error.message });
        }
    });
};
