// Bounding Boxes module for Bubbly Maps
// Author: Linus K. CC BY-NC 4.0.

import { db } from "@/server/db";

export interface BoundingBoxData {
    name: string;
    description?: string;
    color?: string;
    coordinates: GeoJSON.Position[][];
    properties?: Record<string, any>;
    active?: boolean;
}

export interface BoundingBoxUpdateData {
    name?: string;
    description?: string;
    color?: string;
    coordinates?: GeoJSON.Position[][];
    properties?: Record<string, any>;
    active?: boolean;
}

export class BoundingBoxes {
    static async getAll(activeOnly: boolean = true) {
        const where = activeOnly ? { active: true } : {};

        const boundingBoxes = await db.boundingBox.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return boundingBoxes.map(box => ({
            id: box.id,
            name: box.name,
            description: box.description,
            color: box.color,
            coordinates: box.coordinates as GeoJSON.Position[][],
            properties: box.properties as Record<string, any> || {},
            active: box.active,
            createdAt: box.createdAt,
            updatedAt: box.updatedAt
        }));
    }

    static async getById(id: number) {
        const boundingBox = await db.boundingBox.findUnique({
            where: { id }
        });

        if (!boundingBox) return null;

        return {
            id: boundingBox.id,
            name: boundingBox.name,
            description: boundingBox.description,
            color: boundingBox.color,
            coordinates: boundingBox.coordinates as GeoJSON.Position[][],
            properties: boundingBox.properties as Record<string, any> || {},
            active: boundingBox.active,
            createdAt: boundingBox.createdAt,
            updatedAt: boundingBox.updatedAt
        };
    }

    static async create(data: BoundingBoxData) {
        const boundingBox = await db.boundingBox.create({
            data: {
                name: data.name,
                description: data.description,
                color: data.color || "#ff8c00",
                coordinates: data.coordinates,
                properties: data.properties || {},
                active: data.active !== false
            }
        });

        return {
            id: boundingBox.id,
            name: boundingBox.name,
            description: boundingBox.description,
            color: boundingBox.color,
            coordinates: boundingBox.coordinates as GeoJSON.Position[][],
            properties: boundingBox.properties as Record<string, any> || {},
            active: boundingBox.active,
            createdAt: boundingBox.createdAt,
            updatedAt: boundingBox.updatedAt
        };
    }

    static async update(id: number, data: BoundingBoxUpdateData) {
        const boundingBox = await db.boundingBox.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.color !== undefined && { color: data.color }),
                ...(data.coordinates !== undefined && { coordinates: data.coordinates }),
                ...(data.properties !== undefined && { properties: data.properties }),
                ...(data.active !== undefined && { active: data.active }),
                updatedAt: new Date()
            }
        });

        return {
            id: boundingBox.id,
            name: boundingBox.name,
            description: boundingBox.description,
            color: boundingBox.color,
            coordinates: boundingBox.coordinates as GeoJSON.Position[][],
            properties: boundingBox.properties as Record<string, any> || {},
            active: boundingBox.active,
            createdAt: boundingBox.createdAt,
            updatedAt: boundingBox.updatedAt
        };
    }

    static async delete(id: number) {
        await db.boundingBox.delete({
            where: { id }
        });
        return true;
    }
}