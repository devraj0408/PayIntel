from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
import numpy as np


def quantum_risk_score(classical_risk):

    qc = QuantumCircuit(1, 1)

    # convert classical risk to rotation angle
    angle = classical_risk * np.pi

    qc.ry(angle, 0)

    qc.measure(0, 0)

    simulator = AerSimulator()

    result = simulator.run(qc, shots=1000).result()

    counts = result.get_counts()

    fraud_probability = counts.get('1', 0) / 1000

    return fraud_probability