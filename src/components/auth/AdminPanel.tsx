import React, { useState, useEffect } from 'react';
import { Tabs, Button, notification } from 'antd';
import AdminRoute from './AdminRoute';
import LayerPanel from "../crud/LayerPanel";
import FactorPanel from "../crud/FactorPanel";
import QuestionsAdmin from "../crud/QuestionPanel";

const AdminPanel: React.FC = () => {
    return (
        <AdminRoute>
            <div className="admin-panel">
                <h1>Административная панель</h1>
                <Tabs
                    items={[
                        { label: 'Слои ЦЗ', key: 'layers', children: <LayerPanel /> },
                        { label: 'Факторы ЦЗ', key: 'factors', children: <FactorPanel /> },
                        { label: 'Вопросы', key: 'questions', children: <QuestionsAdmin /> }
                    ]}
                />
            </div>
        </AdminRoute>
    );
};

export default AdminPanel;