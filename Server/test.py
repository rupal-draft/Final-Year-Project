import pickle
import pandas as pd

def predict_input():
    with open('trained_model.pkl', 'rb') as f:
        model, trained_columns = pickle.load(f)

    df_merged = pd.read_csv('merged_output.csv')

    X_merged = df_merged[trained_columns]

    y_pred = model.predict(X_merged)

    label_map = {1: 'POSITIVE', 0: 'NEGATIVE'}
    y_pred_labels = [label_map[label] for label in y_pred]
    print(y_pred_labels[0])
    return y_pred_labels[0]

