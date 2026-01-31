'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import styles from './swagger.module.css';

type SwaggerProps = {
    specUrl: string;
    specObject?: string;
}

export default function SwaggerViewer({
    specUrl, specObject
}: SwaggerProps) {

    return (
        <div className={styles.container}>
            <div className={styles.viewer}>
                <SwaggerUI
                    url={specUrl}
                    spec={specObject}
                    docExpansion='list'
                    defaultModelsExpandDepth={-1}
                />
            </div>
        </div>
    )

}